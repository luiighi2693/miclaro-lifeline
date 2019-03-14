export default class Util {
  // static checkNumbersOnly(event: any): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   return !(charCode > 31 && (charCode < 48 || charCode > 57));
  // }

  static checkNumbersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode === 8) {
      return true;
    }

    const patron = /[0-9]/;
    return patron.test(String.fromCharCode(charCode));
  }

  static checkCharactersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode === 8 || charCode === 32) {
      return true;
    }

    // Patron de entrada, en este caso solo acepta numeros y letras
    const patron = /[A-Za-z]/;
    return patron.test(String.fromCharCode(charCode));

    // return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
