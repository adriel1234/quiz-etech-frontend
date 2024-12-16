import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Listener para mudar o título com base na rota
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const title = this.getTitle(this.activatedRoute.root);
        this.titleService.setTitle(title);
      });
  }

  private getTitle(route: ActivatedRoute): string {
    let title = 'Default Title'; // Titulo padrão

    // Se a rota tiver um título na propriedade data, usamos ele
    if (route.snapshot.data['title']) {
      title = route.snapshot.data['title'];
    }

    // Se houver um filho da rota, procura o título também
    if (route.firstChild) {
      title = this.getTitle(route.firstChild);
    }

    return title;
  }
}
