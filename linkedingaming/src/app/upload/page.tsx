import Upload from "./upload";

export default function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <h1>Upload a File</h1>
      <p style={{ margin: "10px"}}>Upload a file to analyze its contents.</p>
      <Upload/>
    </div>
  );
}