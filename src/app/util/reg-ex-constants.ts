export class RegExConstants {

  public static NUMBER_LETTER = /^[0-9a-zA-Z]*$/;

  public static TEL = /(^$|^[0-9]{4,7}-[0-9]{3,5}-[0-9]{7,8})$/;

  public static PHONE = /^1[3455789][0-9]{9}$/;

  public static ID_CARD = /^[1-9]\d{5}(18|19|20|21)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;

  public static WEBSITE = /^(http|https){1}:\/\/([A-Za-z0-9]+\.)+[A-Za-z0-9]+$/;
}
