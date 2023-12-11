import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  recipe: any;
  recipeId!: number;
  favorites: any = [];
  constructor(
    private route: ActivatedRoute,
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.favorites = JSON.parse(localStorage.getItem('myFavoriteRecipes')!) || [];
    this.route.params.subscribe(params => {
      this.recipeId = params['id'];
      this.getRecipeDetails();
    })
  }

  getRecipeDetails() {
    this.mainService.getRecipeDetails(this.recipeId).subscribe((res: any) => {
      console.log(res);
      this.recipe = res;
      let isFavorite = this.favorites.find((r: any) => r.id == this.recipe?.id);
      this.recipe = {...this.recipe, isFavorite};
    })
  }

  addToFavorites() {
    if (this.recipe?.isFavorite) {
      this.favorites.splice(
        this.favorites.indexOf(this.favorites.find((r: any) => r.id == this.recipe?.id)!), 1
      )
      localStorage.setItem('myFavoriteRecipes', JSON.stringify(this.favorites));
      this.recipe.isFavorite = false;
      // TODO change isFavorite for this recipe in the stateService.$recipes
    } else {
      let favRecipe = {
        id: this.recipe?.id,
        title: this.recipe?.title,
        image: this.recipe?.image,
        summary: this.recipe?.summary,
        readyInMinutes: this.recipe?.readyInMinutes,
        aggregateLikes: this.recipe?.aggregateLikes,
        isFavorite: true,
      }
      this.favorites.push(favRecipe);
      localStorage.setItem('myFavoriteRecipes', JSON.stringify(this.favorites));
      this.recipe.isFavorite = true;
    }
  }
}
