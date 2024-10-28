class Operation {
    constructor(type, position, chars) {
      this.type = type; // 'insert' or 'delete'
      this.position = position;
      this.chars = chars;
    }
    
    static transform(op1, op2) {
      // Implementation of OT algorithm
      // This is a simplified version
      if (op1.position < op2.position) {
        return op1;
      } else {
        op1.position += op2.type === 'insert' ? op2.chars.length : -op2.chars.length;
        return op1;
      }
    }
  }
  
  module.exports = Operation;