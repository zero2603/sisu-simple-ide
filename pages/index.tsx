import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { parseHtmlToString, parseStringToHtml } from '../utils';
// requests
import {
  getFiles,
  getFileContent,
  saveFileContent,
  deleteFile,
  uploadFile
} from '../requests';

export default function Home() {
  const [files, setFiles] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [displayContent, setDisplayContent] = useState<string>('Please choose a file');
  const [loading, setLoading] = useState<boolean>(false);

  const inputFileRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const files = await getFiles();
      setFiles(files);
    };

    getData();
  }, []);

  const onRefresh = async () => {
    const files = await getFiles();
    setFiles(files);
    setSelectedFile('');
    setDisplayContent('');
  }

  const selectFile = async (filename: string) => {
    setSelectedFile(filename);
    const fileContent = await getFileContent(filename);

    // parse
    const parsedContent = parseStringToHtml(fileContent);
    setDisplayContent(parsedContent);
  }

  const onChangeFormat = (type: string) => {
    window.document.execCommand(type, false);

    if (type === 'createLink') {
      let link = window.prompt("Please enter link:") || "";
      window.document.execCommand('createLink', false, link);
    }
  }

  const onSaveContent = async () => {
    try {
      setLoading(true);
      if (editorRef.current) {
        const results = parseHtmlToString((editorRef.current as any).children)

        await saveFileContent(selectedFile, results);
        window.alert('File saved!');
      }
    } catch (err) {
      console.log(err);
      window.alert('An error occured!');
    } finally {
      setLoading(false);
    }

  }

  const onDeleteFile = async (e: any, filename: string) => {
    e.preventDefault();

    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      await deleteFile(filename);
      onRefresh();
    }
  }

  const onOpenFileWindow = () => {
    if (inputFileRef.current) {
      (inputFileRef.current as HTMLElement).click();
    }
  }

  const onUploadFile = async (e: any) => {
    console.log(e.target.files);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    await uploadFile(formData);
    onRefresh();
  }

  return (
    <div>
      <Head>
        <title>Sisu Simple IDE</title>
        <meta name="description" content="Sisu Simple IDE" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css" />
      </Head>

      <main className='container mt-5 mb-5'>
        <div className='text-center'>
          <h1>Text IDE</h1>
        </div>
        <div className='row mt-5'>
          <div className='col col-md-4'>
            <div>
              <button type="button" className="btn btn-primary w-100 add-file-btn" onClick={onOpenFileWindow}>
                <i className="bi bi-plus"></i>
                <span>Add file</span>
              </button>
              <input ref={inputFileRef} className='d-none' type="file" accept='.txt,.md' onChange={onUploadFile} />
            </div>

            <div className="files mt-4">
              {
                files.map((file: string, idx: number) => (
                  <div className={`file ${file === selectedFile ? 'active' : ''}`} key={idx}>
                    <div className='file-name' onClick={() => selectFile(file)}>
                      <i className="bi bi-file-text"></i>
                      <span className='ms-2'>{file}</span>
                    </div>
                    <i className="bi bi-trash" onClick={(e) => onDeleteFile(e, file)}></i>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='col col-md-8'>
            <div className="editor-wrapper">
              <div className="tools">
                <div data-tip="Embed link" className="tool" onClick={() => onChangeFormat('createLink')} onMouseDown={(e) => e.preventDefault()}>
                  <i className="bi bi-link-45deg"></i>
                </div>
                <div data-tip="Unlink" className="tool" onClick={() => onChangeFormat('unlink')} onMouseDown={(e) => e.preventDefault()}>
                  <i className="bi bi-input-cursor-text"></i>
                </div>
                <div data-tip="Bold" className="tool" onClick={() => onChangeFormat('bold')} onMouseDown={(e) => e.preventDefault()}>
                  <i className="bi bi-type-bold"></i>
                </div>
                <div data-tip="Italic" className="tool" onClick={() => onChangeFormat('italic')} onMouseDown={(e) => e.preventDefault()}>
                  <i className="bi bi-type-italic"></i>
                </div>
                <div data-tip="Underline" className="tool" onClick={() => onChangeFormat('underline')} onMouseDown={(e) => e.preventDefault()}>
                  <i className="bi bi-type-underline"></i>
                </div>
                <div data-tip="Strikethrough" className="tool" onClick={() => onChangeFormat('strikethrough')} onMouseDown={(e) => e.preventDefault()}>
                  <i className="bi bi-type-strikethrough"></i>
                </div>
              </div>
              <div className="editor">
                <div
                  className={`editor-content ${!!selectedFile ? 'editable' : ''}`}
                  contentEditable={!!selectedFile}
                  suppressContentEditableWarning={true}
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                  ref={editorRef}
                >
                </div>
              </div>
              <div className='editor-btn mt-3'>
                {
                  loading ? (
                    <div className="spinner-border text-primary" role="status"></div>
                  ) : (
                    <button className='btn btn-primary' onClick={onSaveContent}>Save</button>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </main>
      <ReactTooltip effect='solid' />
    </div>
  )
}
