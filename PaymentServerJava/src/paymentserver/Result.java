package paymentserver;

//C# TO JAVA CONVERTER WARNING: Java does not allow user-defined value types. The behavior of this class may differ from the original:
//ORIGINAL LINE: struct Result<T>
public final class Result<T>
{
	private boolean success;
	private T value;

	public Result()
	{
	}

	private Result(boolean succes, T value)
	{
		this.success = succes;
		this.value = value;
	}
	public boolean Success()
	{
		return success;
	}
	public T getValue()
	{
		return value;
	}
	public static <T> Result<T> Success(T value)
	{
		return new Result<T>(true, value);
	}
	public static <T> Result<T> Failure(T value)
	{
		return new Result<T>(false, value);
	}

	public Result clone()
	{
		Result varCopy = new Result();

		varCopy.success = this.success;
		varCopy.value = this.value;

		return varCopy;
	}
}