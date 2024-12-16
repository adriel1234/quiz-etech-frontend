import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NavigationExtras, Router} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {URLS} from '../../shared/urls';

interface MatchPayload {
  id: number;
  time_per_question: number;
  description: string;
  question_group: number; // Apenas o ID do grupo
}

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatCard],
  templateUrl: './match.component.html',
  styleUrl: './match.component.scss'
})

export class MatchComponent implements OnInit {
  displayedColumns: string[] = ['id', 'description', 'actions'];
  public dataSource: MatchPayload[] = [];
  public searchDescription: string = '';

  private service: BaseService<MatchPayload>;

  // Injetando o BaseService diretamente no construtor
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Inicializa o BaseService com a URL correta para questões
    this.service = new BaseService<MatchPayload>(http, URLS.MATCH);
  }

  ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {

    this.service.addParameter('description', this.searchDescription);

    // Usando o BaseService para obter todos os itens
    this.service.getAll().subscribe({
      next: (data: MatchPayload[]) => {
        this.dataSource = data.sort((a, b) => a.id - b.id);
      },
      error: () => {
        this.toastr.error('Erro ao carregar as perguntas.');
      },
    });
  }


  public deleteObject(id: number): void {
    this.service.delete(id).subscribe({
      next: () => {
        this.toastr.success('Pergunta excluída com sucesso.');
        this.search(); // Atualiza a lista após a exclusão
      },
      error: () => {
        this.toastr.error('Erro ao excluir a pergunta.');
      },
    });
  }


  public goToPage(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }
}
