/*
Package rust provides a concrete Cataloger implementation relating to packages within the Rust language ecosystem.
*/
package rust

import (
	"github.com/anubhav06/sanrakshya-cli/internal"
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/pkg"
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/pkg/cataloger/generic"
)

// NewCargoLockCataloger returns a new Rust Cargo lock file cataloger object.
func NewCargoLockCataloger() pkg.Cataloger {
	return generic.NewCataloger("rust-cargo-lock-cataloger").
		WithParserByGlobs(parseCargoLock, "**/Cargo.lock")
}

// NewAuditBinaryCataloger returns a new Rust auditable binary cataloger object that can detect dependencies
// in binaries produced with https://github.com/Shnatsel/rust-audit
func NewAuditBinaryCataloger() pkg.Cataloger {
	return generic.NewCataloger("cargo-auditable-binary-cataloger").
		WithParserByMimeTypes(parseAuditBinary, internal.ExecutableMIMETypeSet.List()...)
}
