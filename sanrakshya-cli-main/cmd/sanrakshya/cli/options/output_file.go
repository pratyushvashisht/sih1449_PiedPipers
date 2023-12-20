package options

import (
	"github.com/anchore/clio"
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/sbom"
)

var _ interface {
	clio.FlagAdder
	clio.PostLoader
} = (*OutputFile)(nil)

// Deprecated: OutputFile supports the --file to write the SBOM output to
type OutputFile struct {
	Enabled bool   `yaml:"-" json:"-" mapstructure:"-"`
	File    string `yaml:"file" json:"file" mapstructure:"file"`
}

func (o *OutputFile) AddFlags(flags clio.FlagSet) {
	if o.Enabled {
		flags.StringVarP(&o.File, "file", "",
			"file to write the default report output to (default is STDOUT)")

	}
}

func (o *OutputFile) PostLoad() error {
	if !o.Enabled {
		return nil
	}
	if o.File != "" {
		file, err := expandFilePath(o.File)
		if err != nil {
			return err
		}
		o.File = file
	}
	return nil
}

func (o *OutputFile) SBOMWriter(f sbom.FormatEncoder) (sbom.Writer, error) {
	if !o.Enabled {
		return nil, nil
	}
	writer, err := newSBOMMultiWriter(newSBOMWriterDescription(f, o.File))
	if err != nil {
		return nil, err
	}

	return writer, nil
}
