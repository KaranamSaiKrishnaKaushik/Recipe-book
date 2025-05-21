import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../models/recipe.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import pdfMake from 'src/app/utils/pdfmake-wrapper';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

interface Ingredient {
  baseName: {
    name: string;
  }
}

@Component({
  selector: 'app-recipe-cards-list',
  templateUrl: './recipe-cards-list.component.html',
  styleUrls: ['./recipe-cards-list.component.css'],
})
export class RecipeCardsListComponent implements OnInit {
  selectedCard: Recipe | any;
  constructor(private recipeService: RecipeService) {}
  url = environment.apiUrl;
  recipes: Recipe[] = [];

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();

    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  onCardSelected(recipe: Recipe) {
    this.selectedCard = recipe;
    document.body.classList.add('no-scroll');
  }

  closeOverlay() {
    this.selectedCard = null;
    document.body.classList.remove('no-scroll');
  }

 printCard() {
  const printContents = document.querySelector('.print-card')?.innerHTML;
  const originalContents = document.body.innerHTML;

  if (printContents) {
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
  }
}


  truncate(text: string, words: number): string {
    return text.split(' ').slice(0, words).join(' ') + '...';
  }


sharePDFViaAPI2() {
  const card = this.selectedCard;
  if (!card) return;

  const title = card.name;
  const description = card.description;
  const ingredients = card.ingredients?.map((i: any) => i.baseName?.name || 'Unknown Ingredient') || [];
  const instructions = Array.isArray(card.instructions)
    ? card.instructions.join('\n')
    : card.instructions;

  this.getBase64ImageFromUrl(card.imagePath).then(base64 => {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: title, fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        { image: base64, width: 400, alignment: 'center', margin: [0, 0, 0, 10] },
        { text: description, fontSize: 12, margin: [0, 0, 0, 10] },
        { text: 'Ingredients', style: 'sectionHeader' },
        { ul: ingredients, margin: [0, 0, 0, 10] },
        { text: 'Instructions', style: 'sectionHeader' },
        { text: instructions, fontSize: 11, lineHeight: 1.3 }
      ],
      styles: {
        sectionHeader: {
          fontSize: 14,
          bold: true,
          decoration: 'underline',
          margin: [0, 10, 0, 4]
        }
      }
    };

    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      const file = new File([blob], 'recipe.pdf', { type: 'application/pdf' });

      const nav = navigator as any;
      if (
        typeof nav.canShare === 'function' &&
        nav.canShare({ files: [file] }) &&
        typeof nav.share === 'function'
      ) {
        nav.share({
          files: [file],
          title: card.name || 'Recipe',
          text: 'Check out this recipe!',
        }).catch((err: any) => {
          console.warn('Share failed, falling back to download.', err);
          pdfMake.createPdf(docDefinition).download('recipe.pdf');
        });
      } else {
        pdfMake.createPdf(docDefinition).download('recipe.pdf');
      }
    });
  });
}

getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  if (!imageUrl) {
    return Promise.resolve('');
  }

  return fetch(imageUrl, { mode: 'cors' })
    .then((res): Promise<Blob> => {
      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
      }
      return res.blob();
    })
    .then((blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
    .catch((err): Promise<string> => {
      console.warn(`Image fetch failed for URL: ${imageUrl}`, err);
      return Promise.resolve(''); // Ensure the return type is Promise<string>
    });
}

}
