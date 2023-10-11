import React from 'react'
import { API } from '../../config/api'
import axios from 'axios';

export const fetchMessages = async(page, limit) => {
    const messages = await API.get(`/wedding-messages?page=${page}&limit=${limit}`);
    return messages;
}