"use client";

import { useMemo } from "react";
import { useCategoriesMenuTree } from "@/hooks/use-categories";
import { useBooks } from "@/hooks/use-books";
import { Book } from "@/lib/types";
import {
  collectBookIds,
  findCategoryBySlug,
  findPublicationBySlug,
  findPublicationInTree,
  findSubjectBySlug,
} from "@/lib/menu-tree-utils";

export interface TreeBreadcrumbItem {
  label: string;
  href?: string;
}

export interface TreeListing {
  title: string;
  subtitle: string;
  /** Top-level category ID — books are fetched per category, then filtered */
  categoryId: string;
  /** Book IDs that belong to this node (from the menu tree) */
  bookIds: string[];
  breadcrumb: TreeBreadcrumbItem[];
}

/**
 * Resolves a category / publication / subject listing from URL slugs using the
 * menu tree (already cached by the Navbar), then loads the matching books.
 *
 * - /{categorySlug}                    → category listing
 * - /{categorySlug}/{pubSlug}          → publication listing
 * - /{categorySlug}/{pubSlug}/{subj}   → subject listing
 *
 * /{categorySlug} also falls back to matching a publication slug directly.
 */
export const useTreeListing = (
  categorySlug?: string,
  pubSlug?: string,
  subjectSlug?: string,
) => {
  const { data: tree = [], isLoading: isTreeLoading } =
    useCategoriesMenuTree();

  const listing = useMemo<TreeListing | null>(() => {
    if (!categorySlug) return null;

    const category = findCategoryBySlug(tree, categorySlug);

    // ── /{slug}: category page (with publication fallback) ──
    if (!pubSlug) {
      if (category) {
        return {
          title: category.name,
          subtitle: `Browse books in ${category.name}`,
          categoryId: category.id,
          bookIds: collectBookIds(category),
          breadcrumb: [
            { label: "Home", href: "/" },
            { label: category.name },
          ],
        };
      }
      const found = findPublicationInTree(tree, categorySlug);
      if (found) {
        return {
          title: found.publication.name,
          subtitle: `Browse books from ${found.publication.name}`,
          categoryId: found.category.id,
          bookIds: collectBookIds(found.publication),
          breadcrumb: [
            { label: "Home", href: "/" },
            {
              label: found.category.name,
              href: found.category.route || `/${found.category.slug}`,
            },
            { label: found.publication.name },
          ],
        };
      }
      return null;
    }

    if (!category) return null;
    const publication = findPublicationBySlug(category, pubSlug);
    if (!publication) return null;

    const categoryHref = category.route || `/${category.slug}`;

    // ── /{slug}/{pubSlug}: publication page ──
    if (!subjectSlug) {
      return {
        title: publication.name,
        subtitle: `Browse books from ${publication.name}`,
        categoryId: category.id,
        bookIds: collectBookIds(publication),
        breadcrumb: [
          { label: "Home", href: "/" },
          { label: category.name, href: categoryHref },
          { label: publication.name },
        ],
      };
    }

    // ── /{slug}/{pubSlug}/{subjectSlug}: subject page ──
    const subject = findSubjectBySlug(publication, subjectSlug);
    if (!subject) return null;
    return {
      title: subject.name,
      subtitle: `Browse books in ${subject.name}`,
      categoryId: category.id,
      bookIds: collectBookIds(subject),
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: category.name, href: categoryHref },
        { label: publication.name, href: `${categoryHref}/${publication.slug}` },
        { label: subject.name },
      ],
    };
  }, [tree, categorySlug, pubSlug, subjectSlug]);

  // Books are fetched per top-level category, then narrowed to this node's
  // book IDs (the menu tree carries IDs only — no prices/thumbnails).
  const { data: booksData = [], isLoading: areBooksLoading } = useBooks(
    undefined,
    listing?.categoryId,
    undefined,
    !!listing,
  );

  const books = useMemo<Book[]>(() => {
    if (!listing || listing.bookIds.length === 0) return [];
    const idSet = new Set(listing.bookIds);
    return booksData.filter((book) => idSet.has(book.id));
  }, [booksData, listing]);

  return {
    listing,
    books,
    isLoading: isTreeLoading || (!!listing && areBooksLoading),
    isNotFound: !isTreeLoading && !listing,
  };
};
