// Helpers for resolving menu-tree nodes from URL slugs.
// The /categories/menu/tree response is flat: publications and subjects carry
// their own id/name/slug (see docs/Category_Menu_Tree_API_Guide.md §3-4).

import {
  MenuTreeBook,
  MenuTreeCategory,
  MenuTreePublication,
  MenuTreeSubject,
} from "./types";

// A category is addressable by its slug or its explicit route (e.g. /test_paper)
export const categoryMatchesSlug = (
  category: MenuTreeCategory,
  slug: string,
): boolean => category.slug === slug || category.route === `/${slug}`;

export const findCategoryBySlug = (
  tree: MenuTreeCategory[],
  slug: string,
): MenuTreeCategory | undefined =>
  tree.find((category) => categoryMatchesSlug(category, slug));

export const findPublicationBySlug = (
  category: MenuTreeCategory | undefined,
  pubSlug: string,
): MenuTreePublication | undefined =>
  category?.publications?.find((pub) => pub.slug === pubSlug);

export const findSubjectBySlug = (
  publication: MenuTreePublication | undefined,
  subjectSlug: string,
): MenuTreeSubject | undefined =>
  publication?.subjects?.find((subject) => subject.slug === subjectSlug);

// Fallback for /{pubSlug}: locate a publication anywhere in the tree
export const findPublicationInTree = (
  tree: MenuTreeCategory[],
  pubSlug: string,
): { category: MenuTreeCategory; publication: MenuTreePublication } | null => {
  for (const category of tree) {
    const publication = findPublicationBySlug(category, pubSlug);
    if (publication) return { category, publication };
  }
  return null;
};

// Any node that can hold books, directly or through subjects
interface BookHolder {
  books?: MenuTreeBook[];
  subjects?: { books?: MenuTreeBook[] }[];
  publications?: { subjects?: { books?: MenuTreeBook[] }[] }[];
}

// Collect every book ID beneath a subject, publication, or category node
export const collectBookIds = (node: BookHolder): string[] => {
  const ids = new Set<string>();
  node.books?.forEach((book) => ids.add(book.id));
  node.subjects?.forEach((subject) =>
    subject.books?.forEach((book) => ids.add(book.id)),
  );
  node.publications?.forEach((pub) =>
    pub.subjects?.forEach((subject) =>
      subject.books?.forEach((book) => ids.add(book.id)),
    ),
  );
  return Array.from(ids);
};
