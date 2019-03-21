import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute}                   from '@angular/router';
import {BlogService}                      from '../../../api/blog.service';

@Component({
  selector   : 'app-blog-print-view-content',
  templateUrl: './blog-print-view-content.component.html',
  styleUrls  : ['./blog-print-view-content.component.scss'],
})
export class BlogPrintViewContentComponent implements OnInit, AfterViewInit {

  mdContent = '';
  mdEditorOptions = {
    showBorder               : true,       // Show editor component's border. Default is true
    hideIcons                : ['TogglePreview', 'FullScreen'], // 'Bold', 'Italic', 'Heading', 'Refrence',
    // 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen', Default is empty
    scrollPastEnd            : 0,     // The option for ace editor. Default is 0
    enablePreviewContentClick: false,  // Allow user fire the click event on the preview panel, like href etc. Default is false
    resizable                : false,           // Allow resize the editor
    // markedjsOpt?: MarkedjsOption  // The markedjs option, see https://marked.js.org/#/USING_ADVANCED.md#options
  };

  constructor(private activatedRoute: ActivatedRoute, private blogService: BlogService) {
  }

  ngOnInit() {
    const id = this.activatedRoute.params['value']['id'];
    this.queryBlog(id);

  }

  queryBlog(id) {
    this.blogService.queryAll({id: id}).then(returnData => {
      this.mdContent = returnData[0]['content'].slice();
      setTimeout(()=>{
        window.print();
        history.back();
      },800)
    }).catch(errorData => {
      throw errorData;
    });
  }

  ngAfterViewInit(): void {
    // window.print();
    // history.back();
  }

}
