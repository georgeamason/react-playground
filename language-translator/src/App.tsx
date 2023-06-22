import './App.css'
import {Fragment, useEffect, useState} from "react";
import {z} from 'zod';

const translateApi = 'https://translation.googleapis.com/language/translate/v2';
const apiKey = 'AIzaSyAA6KdT58v4QhA8ODUH-86z99Renn__GXA';

const ZTranslate = z.object({
    data: z.object({
        translations: z.array(z.object({
            detectedSourceLanguage: z.string().optional(),
            model: z.string().optional(),
            translatedText: z.string()
        }))
    })
})

const callApi = async (targetLanguage: string, translate: string) => {
    const response = await fetch(`${translateApi}?` + new URLSearchParams({
        source: 'en',
        target: targetLanguage,
        key: apiKey,
        q: translate
    }));

    if (response.ok){
        const json = await response.json();
        console.log(json);
        return ZTranslate.parse(json);
    }

    throw response;
}

const App = () => {
    const [targetLanguage, setTargetLanguage] = useState<string>('es');
    const [translate, setTranslate] = useState<string>('');
    const [translations, setTranslations] = useState<z.infer<typeof ZTranslate>>();

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
            {translations?.data?.translations?.map(translation => {
                return <p key={translation.translatedText}>{translation.translatedText}</p>
            })}
        </Fragment>
    )
}

export default App
