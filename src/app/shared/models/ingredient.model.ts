import {IngredientIdentity} from "./ingredient-identity.model";

export class Ingredient {
  constructor(public baseName: IngredientIdentity, public amount: number, public id?: string) {
  }
}
