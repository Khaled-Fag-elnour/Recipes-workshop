import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  apiKey = 'c0f6b89b64f94d398de635c645be6d51';
  constructor(private http: HttpClient) {}

  getRandomRecipes(number?: number, offset?: number) {
    // using the search api with random offset calculated in the recipes componenet
    // instead of random recipes api to handle pagination
    return this.http.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${this.apiKey}&number=${number||9}&offset=${offset||0}&addRecipeInformation=true`,
    { headers: new HttpHeaders({'Content-Type': 'application/json',}) });
  }

  searchRecipes(query: string, number?: number, offset?: number) {
    return this.http.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${this.apiKey}&query=${query}&number=${number||9}&offset=${offset||0}&addRecipeInformation=true`,
    { headers: new HttpHeaders({'Content-Type': 'application/json',}) });
  }

  getRecipeDetails(id: number) {
    return this.http.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${this.apiKey}`,
    { headers: new HttpHeaders({'Content-Type': 'application/json',}) });
  }
}
