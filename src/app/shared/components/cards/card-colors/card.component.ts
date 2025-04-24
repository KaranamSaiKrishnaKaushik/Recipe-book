import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router, UrlTree} from "@angular/router";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {

  @Input() title: string = '';
  @Input() content: string = '';
  @Input() footer: string = '';
  @Input() imageUrl?: string;
  @Input() link?: string;

  @Output() cardClick = new EventEmitter<any>();

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
  }

  onCardClick(){
    this.cardClick.emit({
      title: this.title,
      content: this.content,
      footer: this.footer,
      imageUrl: this.imageUrl
    });
  }

  goToRecipes() {
    const tree: UrlTree = this.router.createUrlTree([this.link], {
      relativeTo: this.route,
    });

    const fullUrl: string = this.router.serializeUrl(tree);
    console.log('Navigating to:', fullUrl);

    this.router.navigateByUrl(tree);
  }

  getCardClass(): string {
    switch (this.footer?.toLowerCase()) {
      case 'pizza':
        return 'card-pizza';
      case 'salad':
        return 'card-salad';
      case 'dessert':
        return 'card-dessert';
      default:
        return 'card-default';
    }
  }


}
