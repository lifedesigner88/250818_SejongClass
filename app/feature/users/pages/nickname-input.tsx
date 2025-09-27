import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UsernameInputProps {
    value: string;
    onChange: (value: string) => void;
    beforeNickName: string;
    isUnique: boolean;
    setIsUnique: (value: boolean) => void;
    validation: { isValid: boolean; error?: string };
    setValidation: (value: { isValid: boolean; error?: string }) => void;
}

export function NicknameInput({
                                  value,
                                  onChange,
                                  beforeNickName,
                                  isUnique,
                                  setIsUnique,
                                  validation,
                                  setValidation,
                              }: UsernameInputProps) {
    const [isChecking, setIsChecking] = useState(false)
    const MAX_USER_NAME = 20;
    const MIN_USER_NAME = 3

    const validateNickname = (nickname: string): { isValid: boolean; error?: string } => {
        // 길이 체크
        if (nickname.length < MIN_USER_NAME || nickname.length > MAX_USER_NAME) {
            return { isValid: false, error: `닉네임은 ${MIN_USER_NAME}-${MAX_USER_NAME}자 사이` };
        }

        return { isValid: true };
    };

    const checkUniqueness = async (nickname: string): Promise<boolean> => {
        const response = await fetch('/api/users/is-exist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname,
            })
        })
        const data = await response.json();
        return !data
    }

    useEffect(() => {
        const checkUsername = async () => {
            const localValidation = validateNickname(value);
            setValidation(localValidation);

            if (localValidation.isValid) {
                setIsChecking(true);
                setIsUnique(false);

                try {
                    const unique = await checkUniqueness(value);
                    setIsUnique(unique);
                    if (!unique) {
                        if (beforeNickName === value)
                            setValidation({ isValid: true, error: '기존 nickname 입니다.' });
                        else
                            setValidation({ isValid: false, error: '이미 사용 중인 nickname입니다.' });
                    }
                } catch (error) {
                    setValidation({ isValid: false, error: 'nickname 확인 중 오류가 발생했습니다.' });
                } finally {
                    setIsChecking(false);
                }
            }
        };

        if (value) {
            const debounceTimer = setTimeout(checkUsername, 500);
            return () => clearTimeout(debounceTimer);
        } else {
            setValidation({ isValid: true });
            setIsUnique(false);
        }
    }, [value]);

    const getStatusIcon = () => {
        if (isChecking) return <Loader2 className="h-4 w-4 animate-spin text-blue-500"/>;
        if (!validation.isValid) return <XCircle className="h-4 w-4 text-red-500"/>;
        if (validation.isValid && isUnique || beforeNickName === value) return <CheckCircle className="h-4 w-4 text-green-500"/>;
        return null;
    };

    const getStatusColor = () => {
        if (!validation.isValid) return 'border-red-500 focus-visible:ring-red-500';
        if (validation.isValid && isUnique || beforeNickName === value) return 'border-green-500 focus-visible:ring-green-500';
        return '';
    };

    return (
        <div className="flex flex-col justify-start space-y-2 min-h-[100px]">
            <Label htmlFor="username" className={"text-muted-foreground"}>nickname</Label>
            <div className="relative">
                <Input
                    id="username"
                    value={value}
                    onChange={(e) => {
                        const data = e.target.value;
                        if (data.length <= MAX_USER_NAME) {
                            onChange(data);
                        }
                    }}
                    min={3}
                    max={15}
                    placeholder="사용자명을 입력하세요"
                    className={`pr-8 ${getStatusColor()}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {getStatusIcon()}
                </div>
            </div>

            {/* 에러 메시지 */}
            {
                validation.error && (
                    <p className={`text-sm ${beforeNickName === value ? 'text-emerald-700' : 'text-red-500'}`}>{validation.error}</p>
                )
            }
        </div>
    )
        ;
}