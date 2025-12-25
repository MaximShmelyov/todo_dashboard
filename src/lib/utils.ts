import {CollectionType} from "@prisma/client";

const exhaustiveGuardCollectionType = (_: never): never => {
  throw new Error('Got unexpected value here.');
};

export function getCategoryLabelOfCollectionType(collectionType: CollectionType): string {
  switch (collectionType) {
    case "NOTE":
      return "📝 Notes"
    case "SHOPPING":
      return "🛍 Shopping"
    case "TODO":
      return "✔️ Todo";
    default:
      return exhaustiveGuardCollectionType(collectionType);
  }
}

export function getLabelOfCollectionType(collectionType: CollectionType): string {
  switch (collectionType) {
    case "NOTE":
      return "note"
    case "SHOPPING":
      return "shopping list"
    case "TODO":
      return "todo list";
    default:
      return exhaustiveGuardCollectionType(collectionType);
  }
}

export function getCollectionRoute(collectionType: CollectionType): string {
  switch (collectionType) {
    case "NOTE":
      return "/notes"
    case "SHOPPING":
      return "/shopping"
    case "TODO":
      return "/todos";
    default:
      return exhaustiveGuardCollectionType(collectionType);
  }
}