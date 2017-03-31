import Editor from 'draft-js-plugins-editor';
import undoPlugin from 'draft-js-undo-plugin';
import linkifyPlugin from 'draft-js-linkify-plugin';
import { EditorState } from 'draft-js';

var plugins = [
	undoPlugin(),
	linkifyPlugin()
]

var Textarea = {
	plugins: plugins,
	Editor: Editor,
	EditorState: EditorState
}
window.CaretakerTextareaDependency = Textarea
