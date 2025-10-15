import Header from '../components/header.jsx'

export default function Homepage() {
    return (
        // https://tailwindcss.com/docs/grid-column
        <div className="grid grid-cols-2 gap-2">  
            <p className="bg-[#200000]">I'm the homepage</p>
            <Header></Header>
        </div>
    );
}

/* <Header ></Header>
            <Info></Info>
            <ArtistPanel></ArtistPanel>
            <Navigation></Navigation>
            <Content></Content>*/