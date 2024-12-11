import {Component, OnInit} from '@angular/core';
import {RankingService} from './ranking.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  public matchId: number = 0;
  public rankingList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rankingService: RankingService
  ) {}

  ngOnInit(): void {
    // Obtém o matchId da URL (por exemplo, /ranking/1)
    this.matchId = +this.route.snapshot.paramMap.get('id')!;

    // Chama o serviço para obter o ranking para o match específico
    this.rankingService.getRankingByMatch(this.matchId).subscribe(
      (data) => {
        this.rankingList = data;
      },
      (error) => {
        console.error('Erro ao obter ranking', error);
      }
    );
  }
}
