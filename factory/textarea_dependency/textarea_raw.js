import Editor from 'draft-js-plugins-editor';
import undoPlugin from 'draft-js-undo-plugin';
import linkifyPlugin from 'draft-js-linkify-plugin';
import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin';
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
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
} from 'draft-js-buttons'; // eslint-disable-line import/no-unresolved
var inlineToolbarPlugin = createInlineToolbarPlugin({
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
    BlockquoteButton,
    CodeBlockButton,
  ]
});
var {InlineToolbar} = inlineToolbarPlugin
var plugins = [
	undoPlugin(),
	linkifyPlugin(),
	inlineToolbarPlugin
]

var Textarea = {
	plugins: plugins,
	Editor: Editor,
	EditorState: EditorState,
	InlineToolbar: InlineToolbar,
	ContentState: ContentState,
	convertToRaw: convertToRaw,
	convertFromHTML: convertFromHTML
}
window.CaretakerTextareaDependency = Textarea
