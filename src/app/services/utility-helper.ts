import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UtilityHelper {
    
    validateDegree(data: any): boolean {
        let pattern = new RegExp(/^[a-zA-Z 0-9_.-]*$/g);
        return pattern.test(data);
    }

    validateTitle(data: string): boolean {
        let pattern1 = new RegExp(/^[A-Za-z]+\.*$/g);
        return pattern1.test(data);
    }

    validateonlyAlphabet(data: string): boolean {
        let pattern2 = new RegExp(/^[A-Za-z ]+$/i);
        return pattern2.test(data);
    }

    validateAddress(data: string): boolean{
        // let pattern3 = new RegExp(/^[0-9a-zA-Z\/\\ -.,]+$/g);
        let pattern3 = new RegExp(/^[\/a-zA-Z 0-9-.,]*$/g);
        return pattern3.test(data);
    }

    validateName(data: string): boolean {
        let pattern4 = new RegExp(/^[a-zA-Z 0-9]*$/g);
        return pattern4.test(data);
    }

    validateEmail(data: string): boolean {
        let pattern5 = new RegExp(/^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i);
        return pattern5.test(data);
    }

    validatePostCode(data: string): boolean {
        let postCodePattern = new RegExp(/^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}))$/g);
        return postCodePattern.test(data);
    }

    validateEmailAddress(data: string): boolean {
        // let emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/g);
        let emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i);
        return emailPattern.test(data);
    }
 }