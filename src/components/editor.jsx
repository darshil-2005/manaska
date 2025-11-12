'use client';

import EditorMonaco from '@monaco-editor/react';
import manaskaDSLLanguage from "./manaskaDSLLanguage"; 
import {useCallback} from "react";
import {useTheme} from "next-themes";
import {manaskaLight, manaskaDark} from "./monacoEditorThemes.js";

export default function Editor({scriptCode, setScriptCode}) {

  const {theme, systemTheme} = useTheme();

  const handleMount = useCallback((editor, monaco) => {
    // register language once
    if (!monaco.languages.getLanguages().some(l => l.id === 'manaskaDSL')) {
      monaco.languages.register({ id: 'manaskaDSL' });
      monaco.languages.setMonarchTokensProvider('manaskaDSL', manaskaDSLLanguage);
    }

    monaco.editor.defineTheme('dark', manaskaDark);
    monaco.editor.defineTheme('light', manaskaLight);
    monaco.editor.setTheme(theme == "system" ? systemTheme : theme);
  }, [theme]);

  return (
    <EditorMonaco
    height="90vh"
    defaultLanguage="manaskaDSL"
    theme={theme}
    value={scriptCode}
    onChange={(d) => { setScriptCode(d) }}
    onMount={handleMount}
    options={
      {
        placeholder: "Write your DSL script here....",
        padding: {
          top: 14,
          left: 0,
        },
        minimap: { 
          enabled: false 
        }, 
        scrollbar: {
          vertical: 'hidden',
          horizontail: 'hidden',
        },
        wordWrap: 'on',
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        renderLineHighlight: "none",
    }}
    />
  );
}
