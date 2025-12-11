import React, {useEffect, useId} from 'react';
import {useState} from "react";
import {OAuth2User} from "splitwise-ts";

export interface TokenFlowProps {
    onNext: () => void;
    onChange: (data: { [key: string]: string }) => void;
}

export const TokenFlow: React.FC<TokenFlowProps> = ({ onNext, onChange }) => {
    const [formData, setFormData] = useState({
        clientID: '',
        clientSecret: ''
    })

    const [nextDisabled, setNextDisabled] = useState(true);
    const [accessTokenErrorReceived, setAccessTokenErrorReceived] = useState(false);

    const clientIDID = useId()
    const clientSecretID = useId()

    const handleChange = (event: any) => {
        const { value, name } = event.target
        setFormData({ ...formData, [name]: value })
        onChange({ [name]: value})
        console.log('handlechange')
    }

    useEffect(() => {
        setNextDisabled(true)
        setAccessTokenErrorReceived(false)
        if (formData.clientID && formData.clientSecret) {
            const user = new OAuth2User({
                    clientId: formData.clientID,
                    clientSecret: formData.clientSecret
                })
            user.requestAccessToken()
                .catch((err) => {
                    console.error(`Failed to fetch access token from Splitwise API: ${err.message}`)
                    setAccessTokenErrorReceived(true)
                })
                .then(() => {
                    setNextDisabled(false)
            })
        }
    }, [formData.clientID, formData.clientSecret]);

    return <div>
        <div>
            <h1 className="bold text-lg font-black">Splitwise Credentials</h1>
            <p>Enter Splitwise client ID and secret</p>
            <p>These can be found at ...</p>
        </div>
        <div className="pt-8">
            <label htmlFor={clientIDID}
                   className="block mb-2.5 text-sm font-medium text-heading">Client ID</label>
            <input id={clientIDID} name='clientID'
                   className="w-80 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block px-3 py-2.5 shadow-xs placeholder:text-body"
                   placeholder="Client ID" type='text' onChange={handleChange} />
        </div>
        <div className="pt-2">
            <label
                htmlFor={clientSecretID}
                className="block mb-2.5 text-sm font-medium text-heading">Client Secret</label>
            <input
                id={clientSecretID}
                className="w-80 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block px-3 py-2.5 shadow-xs placeholder:text-body"
                name='client_secret' placeholder="Client Secret" type='password' onChange={handleChange} />
        </div>
        {
            accessTokenErrorReceived && (<div className="p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft">
                <span className="text-red-800 font-bold">Failed to get access token from Splitwise API</span>
            </div>)
        }
        {
            !nextDisabled && (<div className="p-4 mb-4 text-sm text-fg-success-strong rounded-base bg-success-soft">
                <span className="text-green-800 font-bold">Got token from Splitwise API</span>
            </div>)
        }
        <footer className="pt-4">
            <button
                className={nextDisabled ? "bg-gray-500 text-grey font-bold py-2 px-4 rounded" : "max-w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                onClick={onNext} disabled={nextDisabled}>Next</button>
        </footer>
    </div>
}