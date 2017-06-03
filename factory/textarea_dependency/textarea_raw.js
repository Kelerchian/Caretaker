// import Editor from 'draft-js-plugins-editor';
// import undoPlugin from 'draft-js-undo-plugin';
// import linkifyPlugin from 'draft-js-linkify-plugin';
// import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin';
// import { EditorState, RichUtils, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
// import { convertToHTML } from 'draft-convert';
//
// var pluginsHTML = {
// 	createUndoPlugin: undoPlugin,
// 	createLinkifyPlugin: linkifyPlugin,
// }
//
//
// var Textarea = {
// 	pluginsHTML: pluginsHTML,
// 	Editor: Editor,
// 	EditorState: EditorState,
// 	ContentState: ContentState,
// 	convertToRaw: convertToRaw,
// 	convertFromHTML: convertFromHTML,
// 	convertToHTML: convertToHTML,
// 	RichUtils: RichUtils
// }

import DraftJS from 'draft-js';
import { convertToHTML } from 'draft-convert';

Caretaker.StructBank.register('draft-js', DraftJS)
Caretaker.StructBank.register('draft-convert', {convertToHTML})
