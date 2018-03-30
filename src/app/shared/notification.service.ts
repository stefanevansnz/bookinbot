import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class NotificationService {

    message = new Subject();

    setMessage(message: string) {
        this.message.next(message);
    }

    clearMessage() {
        this.message.next();
    }

    getMessage() {
        return this.message.asObservable();
    }

}
