'use client';

import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Prevent double injection
    if (document.getElementById('google-translate-script')) return;

    const addScript = document.createElement('script');
    addScript.id = 'google-translate-script';
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { 
          pageLanguage: 'en',
          // Only show Indian languages to keep it relevant to the context
          includedLanguages: 'hi,bn,te,mr,ta,ur,gu,kn,or,ml,pa,as,mai,sat,ks,en', 
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div id="google_translate_element" className="google-translate-container"></div>
  );
};

export default GoogleTranslate;
