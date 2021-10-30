var company = {
    name: "New Originated Company",
    address: "32 Made Up Address, Planet Earth",
    staffNo: 1,
    increaseStaffNo: function(new_no) {
        this.staffNo = this.staffNo + new_no;
        return this.name + ' located at ' + this.address + ' has a total staff number of ' + this.staffNo;
    }
}

console.log(company.increaseStaffNo(2));