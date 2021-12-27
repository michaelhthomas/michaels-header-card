import { Quote } from '../types';

export default async function getQuote(): Promise<Quote> {
  const url = 'https://api.quotable.io/random';

  const options = {
    minLength: 100,
    maxLength: 150,
    tags: "inspirational|famous-quotes|wisdom"
  }
  
  const optionsString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
  const quoteData = await (await fetch(url + "?" + optionsString)).json();

  return {
    content: quoteData.content,
    author: quoteData.author
  }
}