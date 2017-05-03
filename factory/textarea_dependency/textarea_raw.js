import Editor from 'draft-js-plugins-editor';
import undoPlugin from 'draft-js-undo-plugin';
import linkifyPlugin from 'draft-js-linkify-plugin';
import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin';
import linkifyIt from 'linkify-it'
import { EditorState, RichUtils, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';

var pluginsHTML = {
	createUndoPlugin: undoPlugin,
	createLinkifyPlugin: linkifyPlugin,
}


var Textarea = {
	pluginsHTML: pluginsHTML,
	Editor: Editor,
	EditorState: EditorState,
	ContentState: ContentState,
	convertToRaw: convertToRaw,
	convertFromHTML: convertFromHTML,
	convertToHTML: convertToHTML,
	linkifyIt: linkifyIt,
	RichUtils: RichUtils
}
window.CaretakerTextareaDependency = Textarea
