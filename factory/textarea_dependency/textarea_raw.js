import Editor from 'draft-js-plugins-editor';
import undoPlugin from 'draft-js-undo-plugin';
import linkifyPlugin from 'draft-js-linkify-plugin';
import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin';
import linkifyIt from 'linkify-it'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
	AlignBlockCenterButton,
	AlignBlockDefaultButton,
	AlignBlockLeftButton,
	AlignBlockRightButton
} from 'draft-js-buttons';
var inlineToolbarPluginParams = {
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton
  ]
}
var pluginsHTML = {
	createUndoPlugin: undoPlugin,
	createLinkifyPlugin: linkifyPlugin,
	createInlineToolbarPlugin: createInlineToolbarPlugin,
	inlineToolbarPluginParams: inlineToolbarPluginParams
}


var Textarea = {
	pluginsHTML: pluginsHTML,
	Editor: Editor,
	EditorState: EditorState,
	ContentState: ContentState,
	convertToRaw: convertToRaw,
	convertFromHTML: convertFromHTML,
	convertToHTML: convertToHTML,
	linkifyIt: linkifyIt
}
window.CaretakerTextareaDependency = Textarea
