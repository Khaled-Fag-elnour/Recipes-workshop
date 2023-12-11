import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  loading = true;
  @ViewChild('toast') toast: ElementRef | null = null;
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
    this.loading = true;
    this.mainService.getRecipeDetails(this.recipeId).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
      this.recipe = res;
      let isFavorite = this.favorites.find((r: any) => r.id == this.recipe?.id);
      this.recipe = {...this.recipe, isFavorite};
    }, err => {
      console.log(err);
      this.loading = false;
    })
  }

  showToast() {
    let toastTimeout;
    this.toast!.nativeElement.style.opacity = 1;
    this.toast!.nativeElement.style.visibility = 'visible';

    toastTimeout = setTimeout(() => {
      this.toast!.nativeElement.style.opacity = 0;
      this.toast!.nativeElement.style.visibility = 'hidden';
    }, 1500)
  }

  addToFavorites() {
    if (this.recipe?.isFavorite) {
      this.favorites.splice(
        this.favorites.indexOf(this.favorites.find((r: any) => r.id == this.recipe?.id)!), 1
      )
      localStorage.setItem('myFavoriteRecipes', JSON.stringify(this.favorites));
      this.showToast();
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
      this.showToast();
      this.recipe.isFavorite = true;
    }
  }
}
