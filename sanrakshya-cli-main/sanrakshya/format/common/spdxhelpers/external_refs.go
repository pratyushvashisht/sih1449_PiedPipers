package spdxhelpers

import (
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/cpe"
	"github.com/anubhav06/sanrakshya-cli/sanrakshya/pkg"
)

func ExternalRefs(p pkg.Package) (externalRefs []ExternalRef) {
	externalRefs = make([]ExternalRef, 0)

	for _, c := range p.CPEs {
		externalRefs = append(externalRefs, ExternalRef{
			ReferenceCategory: SecurityReferenceCategory,
			ReferenceLocator:  cpe.String(c),
			ReferenceType:     Cpe23ExternalRefType,
		})
	}

	if p.PURL != "" {
		externalRefs = append(externalRefs, ExternalRef{
			ReferenceCategory: PackageManagerReferenceCategory,
			ReferenceLocator:  p.PURL,
			ReferenceType:     PurlExternalRefType,
		})
	}

	return externalRefs
}