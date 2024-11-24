import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {QuestionService} from '../../shared/services/question.service';
import {QuestionAnswerFormComponent} from './question-answer-form/question-answer-form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NavigationExtras, Router} from '@angular/router';
import {QuestionGroup} from '../../shared/models/question-group.model';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../shared/urls';
import {Question} from '../../shared/models/question.model';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatCard],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'description', 'actions'];
  public dataSource: Question[] = [];
  public searchDescription: string = '';

  private service: BaseService<Question>;

  // Injetando o BaseService diretamente no construtor
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Inicializa o BaseService com a URL correta para questões
    this.service = new BaseService<Question>(http, URLS.QUESTION);
  }

  ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {

    this.service.addParameter('description', this.searchDescription);

    // Usando o BaseService para obter todos os itens
    this.service.getAll().subscribe({
      next: (data: Question[]) => {
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

  public updateObject(question: Question): void {
    this.service.update(question.id, question).subscribe({
      next: () => {
        this.toastr.success('Atualização bem-sucedida.');
        this.search(); // Atualiza a lista após a atualização
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar a pergunta.', err);
      },
    });
  }



  public goToPage(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }
}
