import React, {useId} from 'react';
import {useState} from "react";

export interface TokenFlowProps {
    onNext: () => void;
    onChange: (data: { [key: string]: string }) => void;
}

export const TokenFlow: React.FC<TokenFlowProps> = ({ onNext, onChange }) => {
    const [formData, setFormData] = useState({
        clientID: '',
        clientSecret: ''
    })

    const clientIDID = useId()
    const clientSecretID = useId()

    const handleChange = (event: any) => {
        const { value, name } = event.target
        setFormData({ ...formData, [name]: value })
        onChange({ [name]: value})
    }

    return <div>
        <div>
            <h1>Splitwise Credentials</h1>
            <p>Enter Splitwise client ID and secret</p>
        </div>
        <div>
            <label htmlFor={clientIDID}
                   className="block mb-2.5 text-sm font-medium text-heading">Client ID</label>
            <input id={clientIDID} name='clientID'
                   className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                   placeholder="Client ID" type='text' onChange={handleChange} />
        </div>
        <div>
            <label
                htmlFor={clientSecretID}
                className="block mb-2.5 text-sm font-medium text-heading">Client Secret</label>
            <input
                id={clientSecretID}
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                name='client_secret' placeholder="Client Secret" type='password' onChange={handleChange} />
        </div>
        <footer>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onNext}>Next</button>
        </footer>
    </div>
}