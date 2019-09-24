import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Todo } from '../model/todo.model';
import { AppState } from 'src/app/app.reducers';
import * as fromActions from '../todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styles: []
})
export class TodoItemComponent implements OnInit {

  @Input() todo: Todo;
  chkField: FormControl;
  txtInput: FormControl;
  editando: boolean;
  @ViewChild('txtInputFisico', {static: true}) txtInputFisico: ElementRef;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.chkField = new FormControl(this.todo.completado);
    this.txtInput = new FormControl(this.todo.texto, Validators.required);
    
    this.chkField.valueChanges.subscribe(valor => {
      // console.log(valor);
      const accion = new fromActions.ToggleTodoAction(this.todo.id);
      this.store.dispatch(accion);
    });
  }

  editar() {
    this.editando = true;
    setTimeout(() => {
      this.txtInputFisico.nativeElement.select(); //select -> para selecionar todo el texto
    }, 1);
  }

  terminarEdicion(){
    this.editando = false;

    if(this.txtInput.invalid){
      this.txtInput.setValue(this.todo.texto); // para que no se elimine el valor por defecto
      return;
    }

    // Si es el mismo valor , no cambio nada
    if(this.txtInput.value === this.todo.texto){
      return;
    }

    const accion = new fromActions.EditarTodoAction(this.todo.id, this.txtInput.value);
    this.store.dispatch(accion);
  }

  borrarTodo(){
    const accion = new fromActions.BorrarTodoAction(this.todo.id);
    this.store.dispatch(accion);
  }

}
