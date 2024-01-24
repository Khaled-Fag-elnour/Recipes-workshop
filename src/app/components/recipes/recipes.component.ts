import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  loading = true;
  page = '';
  favorites: any = [];
  recipes: any = [];
  subs: Subscription[] = [];
  pageSize = 9;
  offset = 0;
  numOfPages = 0;
  pageNumber = 0;
  totalRecords = 0;
  searchValue = '';
  @ViewChild('toast') toast: ElementRef | null = null;
  constructor(
    private mainService: MainService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.favorites = JSON.parse(localStorage.getItem('myFavoriteRecipes')!) || [];
    this.offset = Math.round(Math.random() * 900);
    console.log(this.offset);

    this.route.url.subscribe((segments) => {
      const url = segments.join('/');
      if (url.endsWith('favorites')) {
        this.page = 'favorites'
        this.recipes = this.favorites;
        this.loading = false;
      } else {
        this.page = 'home'
        this.subs.push(this.stateService.$recipes.subscribe((res: any) => {
          if (res.length <= 0) {
            this.getRecipes();
          } else {
            this.handlePagingData(res);
            this.recipes = res.results;
            this.loading = false;
          }
        }));
      }
    });
  }

  getRecipes() {
    this.loading = true;
    this.mainService.getRandomRecipes(this.pageSize, this.offset).subscribe((res: any) => {
      this.loading = false;
      console.log(res);

      let results = res?.results.map((r: any) => {
        let isFavorite = this.favorites.find((favRecipe: any) => favRecipe.id == r.id);
        r = {...r, isFavorite};
        return r;
      })

      this.handlePagingData(res);

      this.stateService.$recipes.next({...res, results});
    }, err => {
      this.loading = false;
    })
  }

  searchRecipes(searchValue: string, pageSize?: number, offset?: number) {
    if (searchValue) {
      this.searchValue = searchValue;
    }
    // if (this.searchValue) {
      if (this.page == 'home') {
        this.loading = true;
        this.mainService.searchRecipes(searchValue, pageSize, offset).subscribe((res: any) => {
          this.loading = false;
          console.log(res);

          let results = res?.results.map((r: any) => {
            let isFavorite = this.favorites.find((favRecipe: any) => favRecipe.id == r.id);
            r = {...r, isFavorite};
            return r;
          })

          this.handlePagingData(res);

          this.stateService.$recipes.next({...res, results});
        }, err => {
          console.log(err);
          this.loading = false;
        })
      } else {
        console.log(this.favorites);

        this.recipes = this.favorites.filter((r: any) => r.title.trim().toLowerCase().includes(searchValue.trim().toLowerCase()));
      }
    // }
  }

  handlePagingData(data: any) {
    this.numOfPages = Math.ceil(data.totalResults / data.number);
    this.pageNumber = Math.floor((data.offset / data.number) + 1);
    this.totalRecords = data.totalResults;
  }

  addToFavorites(e: Event, recipe: any) {
    e.stopPropagation();
    e.preventDefault();
    if (recipe?.isFavorite) {
      this.favorites.splice(
        this.favorites.indexOf(this.favorites.find((r: any) => r.id == recipe?.id)!), 1
      )
      localStorage.setItem('myFavoriteRecipes', JSON.stringify(this.favorites));
      this.showToast();
      recipe.isFavorite = false;
      // TODO change isFavorite for this recipe in the stateService.$recipes
    } else {
      let favRecipe = {
        id: recipe?.id,
        title: recipe?.title,
        image: recipe?.image,
        summary: recipe?.summary,
        readyInMinutes: recipe?.readyInMinutes,
        aggregateLikes: recipe?.aggregateLikes,
        isFavorite: true,
      }
      this.favorites.push(favRecipe);
      localStorage.setItem('myFavoriteRecipes', JSON.stringify(this.favorites));
      this.showToast();
      recipe.isFavorite = true;
    }
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

  previous() {
    this.offset -= this.pageSize;
    if (this.page == 'home') {
      if (this.searchValue) {
        this.searchRecipes(this.searchValue, this.pageSize, this.offset);
      } else {
        this.getRecipes();
      }
    } else {

    }
  }

  next() {
    this.offset += this.pageSize;
    if (this.page == 'home') {
      if (this.searchValue) {
        this.searchRecipes(this.searchValue, this.pageSize, this.offset);
      } else {
        this.getRecipes();
      }
    } else {

    }
  }

  paginate(pageNumber: number) {
    console.log(pageNumber);

    if (pageNumber == 1) {
      this.offset = 0;
    } else {
      this.offset = ((pageNumber - 1) * this.pageSize);
    }
    console.log(this.offset);

    if (this.page == 'home') {
      if (this.searchValue) {
        this.searchRecipes(this.searchValue, this.pageSize, this.offset);
      } else {
        this.getRecipes();
      }
    } else {
      this.pageNumber = pageNumber;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
