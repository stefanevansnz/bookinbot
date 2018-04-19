import { Injectable } from "@angular/core";

@Injectable()
export class BookingsColourPickerService {

    private userColours = [];

    private colourList = [
        '#378006',
        '#236AB9',
        '#F78106'
    ];

    private colourIndex = 0;

    pickBookingColour(username: string) {
        // search for username
        let result = this.userColours[username];
        if (result == undefined) {
            // username not found then allocate colour
            this.userColours[username] = this.colourList[this.colourIndex++];
            if (this.colourIndex > this.colourList.length) {
                this.colourIndex = 0; // start again
            }
        }

        console.log('pick colour for ' + username + ' is ' + this.userColours[username]);
        return this.userColours[username];
    }

}