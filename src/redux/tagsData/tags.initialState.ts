import { Tag } from "@interface/tags.interface";

export interface TagInitialState {
  tags: Tag[];
  isLoader: boolean;
}
export const tagInitialState: TagInitialState = {
  tags: [],
  isLoader: false,
};
