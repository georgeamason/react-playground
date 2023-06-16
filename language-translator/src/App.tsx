import './App.css'
import {Fragment, useEffect, useState} from "react";

const translateApi = 'https://translation.googleapis.com/language/translate/v2';
const apiKey = '';

interface Translation {
    translatedText: string;
}

const callApi = async (targetLanguage: string, translate: string) : Promise<Translation[]> => {
    const response = await fetch(`${translateApi}?` + new URLSearchParams({
        source: 'en',
        target: targetLanguage,
        key: apiKey,
        q: translate
    }));

    if (response.ok){
        const json = await response.json();
        return json.data.translations;
    }

    throw response;
}

const App = () => {
    const [targetLanguage, setTargetLanguage] = useState<string>('es');
    const [translate, setTranslate] = useState<string>('');
    const [translations, setTranslations] = useState<Translation[]>();

    console.log('App.tsx');

    useEffect(() => {
        console.log('useEffect');
        void (async () => {
            const x = await callApi(targetLanguage, translate);
            setTranslations(x);
        })();
    }, [translate, targetLanguage]);

    return (
        <Fragment>
            <input type="text" onChange={event => {
                setTranslate(() => event.target.value);
            }}/>
            <hr/>
            <div>
                <button onClick={() => setTargetLanguage('es')}>Spanish</button>
                <button onClick={() => setTargetLanguage('fr')}>French</button>
                <button onClick={() => setTargetLanguage('de')}>German</button>
                <button onClick={() => setTargetLanguage('pt')}>Portuguese</button>
                <button onClick={() => setTargetLanguage('it')}>Italian</button>
            </div>
            <hr/>
            {translations?.map(translation => {
                return <p key={translation.translatedText}>{translation.translatedText}</p>
            })}
        </Fragment>
    )
}

export default App
