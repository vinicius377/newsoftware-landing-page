export const phone = {
    apply: (value: string) => {
      if (!value) return '';
  
      let regexp: RegExp;
  
      if (value.length === 10) {
        regexp = /^(\d{0,2})(\d{0,4})(\d{0,4}).*/;
      } else {
        regexp = /^(\d{0,2})(\d{0,5})(\d{0,4}).*/;
      }
  
      const result = value.length > 2 ? '($1) $2-$3' : '($1$2$3';
  
      return value.replace(regexp, result).replace(/-$/, '');
    },
    clean: (value: string) => (value || '').replace(/\D/gi, '').substr(0, 11)
  };
  
  
  