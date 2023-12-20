/*
Package gentoo provides a concrete Cataloger implementation related to packages within the Gentoo linux ecosystem.
*/
package gentoo

import (
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/pkg"
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/pkg/cataloger/generic"
)

// NewPortageCataloger returns a new cataloger object initialized for Gentoo Portage package manager files (a flat-file store).
func NewPortageCataloger() pkg.Cataloger {
	return generic.NewCataloger("portage-cataloger").
		WithParserByGlobs(parsePortageContents, "**/var/db/pkg/*/*/CONTENTS")
}
