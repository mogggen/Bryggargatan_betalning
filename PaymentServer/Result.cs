using System;
using System.Collections.Generic;
using System.Text;

namespace PaymentServer
{
    struct Result<T>
    {
        bool success;
        T value;

        private Result(bool succes, T value)
        {
            this.success = succes;
            this.value = value;
        }
        public bool Success()
        {
            return success;
        }
        public T Value
        {
            get { return value; }
        }
        public static Result<T> Success(T value)
        {
            return new Result<T>(true, value);
        }
        public static Result<T> Failure(T value)
        {
            return new Result<T>(false, value);
        }
    }
}
