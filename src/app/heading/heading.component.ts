import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {


  constructor(              
    private router: Router,
    private route: ActivatedRoute) {
    

  }

  ngOnInit() {
    console.log('path in header' + this.route.url );
    console.log('route ' + this.route.snapshot.url); 
 
  }

}
