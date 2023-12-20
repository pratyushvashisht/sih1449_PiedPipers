package commands

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"

	"github.com/anchore/clio"
	"github.com/anubhav06/sanrakshya-cli/cmd/sanrakshya/cli/options"
	"github.com/anubhav06/sanrakshya-cli/internal"
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/format/sanrakshyajson/model"
)

const (
	submitExample = `
  Submit the SBOM data to Sanrakshya Enterprise Server for further analysis.
  Supports the following image sources:
	{{.appName}} {{.command}} path/to/a/sbom-file      					 a JSON SBOM file generated by {{.appName}}
  `
)

type submitOptions struct {
	options.Credentials `yaml:",inline" mapstructure:",squash"`
}

type sbomData struct {
	AccountID string         `json:"account_id"`
	SecretKey string         `json:"secret_key"`
	SBOMFile  model.Document `json:"document"`
}

func defaultSubmitOptions() *submitOptions {
	return &submitOptions{
		Credentials: options.DefaultCredentials(),
	}
}

//nolint:dupl
func Submit(app clio.Application) *cobra.Command {
	id := app.ID()

	opts := defaultSubmitOptions()

	return app.SetupCommand(&cobra.Command{
		Use:   "submit [SOURCE]",
		Short: "Submit SBOM to web-app",
		Long:  "Submit the SBOM file data to web-app for vulnerability analysis",
		Example: internal.Tprintf(submitExample, map[string]interface{}{
			"appName": id.Name,
			"command": "submit",
		}),
		Args: validateSubmitArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			// restoreStdout := ui.CaptureStdoutToTraceLog()
			// defer restoreStdout()

			return runSubmit(id, opts, args[0])
		},
	}, opts)
}

func validateSubmitArgs(cmd *cobra.Command, args []string) error {
	return validateArg(cmd, args, "a SBOM JSON file argument is required")
}

func validateArg(cmd *cobra.Command, args []string, error string) error {
	if len(args) == 0 {
		// in the case that no arguments are given we want to show the help text and return with a non-0 return code.
		if err := cmd.Help(); err != nil {
			return fmt.Errorf("unable to display help: %w", err)
		}
		return fmt.Errorf(error)
	}

	return cobra.MaximumNArgs(1)(cmd, args)
}

func getCredentialsFromConfig() (string, string) {
	// Get the installation location of the CLI tool
	exe, err := os.Executable()
	if err != nil {
		panic(err)
	}
	installDir := filepath.Dir(exe)

	// The file where the credentials are stored
	credsFile := filepath.Join(installDir, "creds.json")

	// Read the credentials from the file
	credsBytes, err := ioutil.ReadFile(credsFile)
	if err != nil {
		panic(err)
	}

	// Parse the credentials
	var creds struct {
		AccountID string `json:"account_id"`
		SecretKey string `json:"secret_key"`
	}
	err = json.Unmarshal(credsBytes, &creds)
	if err != nil {
		panic(err)
	}

	return creds.AccountID, creds.SecretKey

}

func runSubmit(id clio.Identification, opts *submitOptions, userInput string) error {
	accountID, secretKey := getCredentialsFromConfig()
	fmt.Println("accountID: ", accountID, "SecretKey: ", secretKey)

	// Read the SBOM file
	file, err := os.Open(userInput)
	if err != nil {
		return fmt.Errorf("failed to open SBOM file: %w", err)
	}
	defer file.Close()

	// Add credentials to SBOM struct
	sbom := sbomData{
		AccountID: accountID,
		SecretKey: secretKey,
	}

	// Read the SBOM file content
	sbomFileContent, err := ioutil.ReadAll(file)
	if err != nil {
		return fmt.Errorf("failed to read SBOM file: %w", err)
	}

	if err := json.Unmarshal(sbomFileContent, &sbom.SBOMFile); err != nil {
		return fmt.Errorf("failed to marshal SBOM data: %w", err)
	}

	// Convert SBOM data to JSON
	jsonData, err := json.Marshal(sbom)
	if err != nil {
		return fmt.Errorf("failed to marshal SBOM data to JSON: %w", err)
	}

	// Send the SBOM to the web-app via API
	url := "http://127.0.0.1:8000/api/submit-sbom/"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send SBOM data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to send SBOM data: received status code %d", resp.StatusCode)
	}

	fmt.Println("SBOM data sent successfully")

	return nil
}