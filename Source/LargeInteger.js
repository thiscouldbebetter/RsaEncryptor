
class LargeInteger
{
	constructor(base)
	{
		this.base = base;
		this.digits = [];
	}

	add(other)
	{
		var numberOfDigitsInThis = this.digits.length;
		var numberOfDigitsInOther = other.digits.length;
 
		var numberOfDigitsGreater;
	
		if (numberOfDigitsInThis >= numberOfDigitsInOther)
		{
			numberOfDigitsGreater = numberOfDigitsInThis;
		}
		else
		{
			numberOfDigitsGreater = numberOfDigitsInOther;
		}

		var numberOfDigitsInSum = numberOfDigitsGreater + 1;

		this.expandNumberOfDigitsTo(numberOfDigitsInSum);
		other.expandNumberOfDigitsTo(numberOfDigitsInSum);

		var carryDigit = 0;

		for (var i = 0; i < numberOfDigitsInSum; i++)
		{
			var sumAtDigit =
				this.digits[i]
				+ other.digits[i]
				+ carryDigit;

			var digitValue = sumAtDigit % this.base;
			carryDigit = (sumAtDigit - digitValue) / this.base;

			this.digits[i] = digitValue;
		}

		this.removeLeadingZeroes();
		other.removeLeadingZeroes();

		return this;
	}

	appendDigit(digitToAppend)
	{
		// Because the digits are stored
		// in increasing order of significance,
		// technically, it's a prepend.
		this.digits.splice(0, 0, digitToAppend);
		return this;
	}

	clone()
	{
		var returnValue = new LargeInteger(this.base);
		returnValue.overwriteWith(this);
		return returnValue;
	}

	decrement()
	{
		return this.subtract
		(
			new LargeInteger(this.base).setFromInt(1)
		);
	}

	divide(other)
	{
		var dividend = this.clone();
		var divisor = other.clone();
		var base = dividend.base;

		var one = new LargeInteger(base).setFromInt(1);

		var lengthOfDivisorInDigits =
			divisor.digits.length;

		var differenceInLengths =
			dividend.digits.length
			- lengthOfDivisorInDigits;

		dividend.multiplyByBaseRaisedTo
		(
			lengthOfDivisorInDigits
		);

		divisor.multiplyByBaseRaisedTo
		(
			differenceInLengths
			+ lengthOfDivisorInDigits
		);

		var result = new LargeInteger(base).setFromInt(0);

		while (divisor.digits.length > 0)
		{
			if (divisor.isLessThanOrEqualTo(dividend))
			{
				dividend.subtract(divisor);
				result.add(one);
			}
			else
			{
				divisor.divideByBaseRaisedTo(1);
				result.multiplyByBaseRaisedTo(1);
			}
		}

		result.divideByBaseRaisedTo
		(
			2 * lengthOfDivisorInDigits
		);

		this.overwriteWith(result);

		return this;
	}

	divideByBaseRaisedTo(exponent)
	{
		this.digits.splice(0, exponent);

		return this;
	}

	expandNumberOfDigitsTo(numberOfDigitsTotal)
	{
		var numberOfDigitsToAdd =
			numberOfDigitsTotal - this.digits.length;
		for (var i = 0; i < numberOfDigitsToAdd; i++)
		{
			this.digits.push(0);
		}
 
		return this;
	}
 
	increment()
	{
		return this.add
		(
			new LargeInteger(this.base).setFromInt(1)
		);
	}

	isEqualTo(other)
	{
		var returnValue;
		var numberOfDigitsInThis = this.digits.length;
		var numberOfDigitsInOther = other.digits.length;

		if (numberOfDigitsInThis != numberOfDigitsInOther)
		{
		returnValue = false;
		}
		else
		{
			returnValue = true;

			for (var i = numberOfDigitsInThis - 1; i >= 0; i--)
			{
				var digitThis = this.digits[i];
				var digitOther = other.digits[i];

				if (digitThis != digitOther)
				{
					returnValue = false;
					break;
				}
			}
		}

		return returnValue;
	}

	isGreaterThan(other)
	{
		var returnValue =
			(this.isLessThanOrEqualTo(other) == false);
		return returnValue;
	}

	isGreaterThanOrEqualTo(other)
	{
		var returnValue;
		var numberOfDigitsInThis = this.digits.length;
		var numberOfDigitsInOther = other.digits.length;

		if (numberOfDigitsInThis > numberOfDigitsInOther)
		{
			returnValue = true;
		}
		else if (numberOfDigitsInThis == numberOfDigitsInOther)
		{
			returnValue = true;

			for (var i = numberOfDigitsInThis - 1; i >= 0; i--)
			{
				var digitThis = this.digits[i];
				var digitOther = other.digits[i];

				if (digitThis < digitOther)
				{
					returnValue = false;
					break;
				}
				else if (digitThis > digitOther)
				{
					break;
				}
			}
		}
		else
		{
			returnValue = false;
		}

		return returnValue;
	}

	isLessThan(other)
	{
		var returnValue = (this.isGreaterThanOrEqualTo(other) == false);
		return returnValue;
	}

	isLessThanOrEqualTo(other)
	{
		var returnValue;
		var numberOfDigitsInThis = this.digits.length;
		var numberOfDigitsInOther = other.digits.length;

		if (numberOfDigitsInThis < numberOfDigitsInOther)
		{
			returnValue = true;
		}
		else if (numberOfDigitsInThis == numberOfDigitsInOther)
		{
			returnValue = true;

			for (var i = numberOfDigitsInThis - 1; i >= 0; i--)
			{
				var digitThis = this.digits[i];
				var digitOther = other.digits[i];

				if (digitThis > digitOther)
				{
					returnValue = false;
					break;
				}
				else if (digitThis < digitOther)
				{
					break;
				}
			}
		}
		else
		{
		returnValue = false;
		}

		return returnValue;
	}
 
	isNotEqualTo(other)
	{
		var returnValue = (this.isEqualTo(other) == false);
		return returnValue;
	}
 
	modulo(other)
	{
		var dividend = this.clone();
		var divisor = other.clone();

		var lengthOfDivisorInDigits = divisor.digits.length;
		var differenceInLengths =
			dividend.digits.length - lengthOfDivisorInDigits;

		var divisorOriginal = divisor.clone();
		divisor.multiplyByBaseRaisedTo(differenceInLengths);

		while (divisor.digits.length >= lengthOfDivisorInDigits)
		{
			if (divisor.isLessThanOrEqualTo(dividend))
			{
				dividend.subtract(divisor);
			}
			else
			{
				divisor.divideByBaseRaisedTo(1);
			}
		}

		this.overwriteWith(dividend);

		return this;
	}

	multiply(other)
	{
		var numberOfDigitsInThis =
			this.digits.length;
		var numberOfDigitsInOther =
			other.digits.length;

		var numberOfDigitsInProduct =
			numberOfDigitsInThis + numberOfDigitsInOther;

		var product =
			new LargeInteger
			(
				this.base
			).expandNumberOfDigitsTo
			(
				numberOfDigitsInProduct
			);

		for (var i = 0; i < numberOfDigitsInThis; i++)
		{
			var digitFromThis = this.digits[i];

			for (var j = 0; j < numberOfDigitsInOther; j++)
			{
				var digitFromOther = other.digits[j];

				var productOfDigits =
					digitFromThis
					* digitFromOther;

				var productDigitIndex = i + j;

				var carryDigit = productOfDigits;

				while (carryDigit > 0)
				{
					var sumAtDigit =
						product.digits[productDigitIndex]
						+ carryDigit;

					var digitValue =
						sumAtDigit % this.base;
					carryDigit =
						(sumAtDigit - digitValue) / this.base;

					product.digits[productDigitIndex] = digitValue;

					productDigitIndex++;
				}
			}
		}

		product.removeLeadingZeroes();
		this.overwriteWith(product);

		return this;
	}

	multiplyByBaseRaisedTo(exponent)
	{
		for (var i = 0; i < exponent; i++)
		{
			this.digits.splice(0, 0, 0);
		}

		return this;
	}

	overwriteWith(other)
	{
		var numberOfDigitsInThis = this.digits.length;
		var numberOfDigitsInOther = other.digits.length;
		 
		for (var i = 0; i < numberOfDigitsInOther; i++)
		{
			this.digits[i] = other.digits[i];
		}
		 
		if (numberOfDigitsInThis > numberOfDigitsInOther)
		{
			this.digits.splice
			(
				numberOfDigitsInOther,
				numberOfDigitsInThis - numberOfDigitsInOther
			);
		}
		 
		return this;
	}

	randomize()
	{
		var valueOriginal = this.clone();

		var base =
			new LargeInteger
			(
				this.base
			).setFromInt
			(
				this.base
			);

		var numberOfDigits =
			new LargeInteger
			(
				this.base
			).setFromInt
			(
				this.digits.length
			);

		var valueMaxForNumberOfDigits =
			base.raiseToPower(numberOfDigits);

		for (var i = 0; i < this.digits.length; i++)
		{
			var digitRandom = Math.floor
			(
				Math.random() * this.base
			);
			 
			this.digits[i] = digitRandom;
		}

		this.multiply(valueOriginal).divide(valueMaxForNumberOfDigits);

		return this;
	}

	raiseToPower(exponent)
	{
		var result = this.raiseToPowerBySquaring(exponent);

		this.overwriteWith(result);

		return this;
	}
 
	raiseToPowerBySquaring(exponent)
	{
		var returnValue = LargeInteger.raiseValueToPowerBySquaring
		(
			this.clone(),
			exponent.clone(),
			new LargeInteger(this.base).setFromInt(1),
			new LargeInteger(this.base).setFromInt(2)
		);

		return returnValue;
	}
 
	static raiseValueToPowerBySquaring
	(
		valueToRaise, exponent, constantOne, constantTwo
	)
	{
		var returnValue;

		if (exponent.digits.length == 1 && exponent.digits[0] == 1)
		{
			returnValue = valueToRaise;
		}
		else if (exponent.digits[0] % 2 == 0)
		{
			returnValue = LargeInteger.raiseValueToPowerBySquaring
			(
				valueToRaise.clone().multiply(valueToRaise),
				exponent.clone().divide(constantTwo),
				constantOne,
				constantTwo
			);
		}
		else
		{
			returnValue = LargeInteger.raiseValueToPowerBySquaring
			(
				valueToRaise.clone().multiply(valueToRaise),
				exponent.clone().subtract(constantOne).divide(constantTwo),
				constantOne,
				constantTwo
			).multiply
			(
				valueToRaise
			);
		}

		return returnValue;
	}

	removeLeadingZeroes()
	{
		return this.removeLeadingZeroesDownTo(0);
	}

	removeLeadingZeroesDownTo(numberOfDigitsTotal)
	{
		var i = this.digits.length - 1;

		while (i >= numberOfDigitsTotal && this.digits[i] == 0)
		{
			this.digits.splice(i, 1);
			i--;
		}

		return this;
	}
 
	setFromInt(valueToSet)
	{
		var d = 0;

		while (valueToSet > 0)
		{
			var digitValue = valueToSet % this.base;
				valueToSet = (valueToSet - digitValue) / this.base;
				this.digits[d] = digitValue;

			d++;
		}

		this.removeLeadingZeroes();

		return this;
	}

	setFromString(digitsAsString)
	{
		var digitsAsNumbers = [];

		if (this.base <= 10)
		{
			digitsAsString.split("").reverse().map(x => parseInt(x));
		}
		else
		{
			throw("Not yet implemented!");
		}

		this.digits = digitsAsNumbers;
	}

	setToOne()
	{
		this.digits = [1];
		return this;
	}

	setToZero()
	{
		this.digits = [];
		return this;
	}

	subtract(other)
	{
		var base = this.base;

		var numberOfDigitsInOther = other.digits.length;

		var numberOfDigitsInThis = this.digits.length;
		other.expandNumberOfDigitsTo(numberOfDigitsInThis);

		for (var i = 0; i < numberOfDigitsInOther; i++)
		{
			var digitFromThis = this.digits[i];
			var digitFromOther = other.digits[i];
			 
			if (digitFromThis < digitFromOther)
			{
				var valueBorrowed = 0;
				var j = i;
				 
				while (valueBorrowed == 0)
				{
					j++;
					 
					var digitToBorrowFrom = this.digits[j];
					if (digitToBorrowFrom > 0)
					{
					valueBorrowed = base;
					this.digits[j]--;
					 
					j--;
					while (j > i)
					{
					this.digits[j] = base - 1;
					j--;
					}
					}
				}

				digitFromThis += valueBorrowed;
			}
		 
		this.digits[i] = digitFromThis - digitFromOther;
		}
		 
		this.removeLeadingZeroes();
		other.removeLeadingZeroes();
		 
		return this;
	}

	toInt()
	{
		var returnValue = 0;

		var placeMultiplierCurrent = 1;

		var numberOfDigits = this.digits.length;

		for (var i = 0; i < numberOfDigits; i++)
		{
			returnValue += this.digits[i] * placeMultiplierCurrent;
			placeMultiplierCurrent *= this.base;
		}

		return returnValue;
	}

	toString()
	{
		var returnValue = "";

		var numberOfDigits = this.digits.length;

		for (var i = numberOfDigits - 1; i >= 0; i--)
		{
			returnValue += "" + this.digits[i];
		}

		return returnValue;
	}
}
