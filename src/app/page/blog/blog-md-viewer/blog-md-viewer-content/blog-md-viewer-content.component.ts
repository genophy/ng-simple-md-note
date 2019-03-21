import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector   : 'app-blog-md-viewer-content',
  templateUrl: './blog-md-viewer-content.component.html',
  styleUrls  : ['./blog-md-viewer-content.component.scss'],
})
export class BlogMdViewerContentComponent implements OnInit {
  @Input()
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

  constructor() {
  }

  ngOnInit() {
  }

}
