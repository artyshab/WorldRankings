import logo from '../assets/logo-svgrepo-com.svg';
type TitleProp = {
    title : string ;
}

export default function Title({title} : TitleProp) {
    return (
        <>
        <div className="title-container">
        <img src={logo} alt="Logo" />
        <h1>{title}</h1>
        </div>
        </>
    )
}