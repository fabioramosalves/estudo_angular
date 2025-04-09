import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Observable, startWith, map, of, switchMap } from 'rxjs'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiselectComponent {
  @Input() selectedItens: string[] = []
  @Input() placeholder: string = 'Pesquisar...'
  @Input() fetchItens!: (find: string) => Observable<string[]>
  @Output() selectedItensChange = new EventEmitter<string[]>()


  filtro = new FormControl('')
  filteredItens$: Observable<string[]> = new Observable<string[]>()

  ngOnInit(): void {
    this.filteredItens$ = this.filtro.valueChanges.pipe(
      startWith(''),
      map(value => value?.toLowerCase() || ''),
      switchMap(textFind => {
        if (textFind.length >= 2 && this.fetchItens) {
          return this.fetchItens(textFind)
        }
        return of([])
      })
    )
  }

  toggle(item: string): void {
    const index = this.selectedItens.indexOf(item)
    if (index >= 0)
      this.selectedItens.splice(index, 1)
    else
      this.selectedItens.push(item)
    this.selectedItensChange.emit([...this.selectedItens])
  }

  isSelected(item: string): boolean {
    return this.selectedItens.includes(item)
  }

  clear(): void {
    this.selectedItens = []
    this.filtro.setValue('')
    this.selectedItensChange.emit([]);
  }
}
