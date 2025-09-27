import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UsernameInputProps {
    value: string;
    onChange: (value: string) => void;
    onValidationChange?: (isValid: boolean) => void;
    checkUniqueness?: (username: string) => Promise<boolean>;
}

export const advancedUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|[_-](?![_-])){1,18}[a-zA-Z0-9]$/;

export function UsernameInput({
                                  value,
                                  onChange,
                                  onValidationChange,
                                  checkUniqueness
                              }: UsernameInputProps) {
    const [validation, setValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
    const [isChecking, setIsChecking] = useState(false)
    const [isUnique, setIsUnique] = useState<boolean | null>(null);
    const MAX_USER_NAME = 20;
    const MIN_USER_NAME = 3

    const validateUsername = (username: string): { isValid: boolean; error?: string } => {
        // 길이 체크
        if (username.length < MIN_USER_NAME || username.length > MAX_USER_NAME) {
            return { isValid: false, error: `사용자명은 ${MIN_USER_NAME}-${MAX_USER_NAME}자 사이여야 합니다.` };
        }

        // 기본 패턴 체크
        if (!advancedUsernameRegex.test(username)) {
            return { isValid: false, error: '영문, 숫자, (-), (_)만 사용 가능' };
        }


        // 첫 글자와 마지막 글자 체크
        if (/^[_-]|[_-]$/.test(username)) {
            return { isValid: false, error: '첫 & 마지막 글자 영문 또는 숫자' };
        }

        // 연속된 특수문자 체크
        if (/[_-]{2,}/.test(username)) {
            return { isValid: false, error: '특수문자 연속 불가' };
        }

        // 예약어 체크 (선택사항)
        const reservedWords = ['admin', 'api', 'www', 'mail', 'support', 'help', 'about', 'contact'];
        if (reservedWords.includes(username.toLowerCase())) {
            return { isValid: false, error: '사용할 수 없는 예약어 입니다.' };
        }

        return { isValid: true };
    };


    useEffect(() => {
        const checkUsername = async () => {
            const localValidation = validateUsername(value);
            setValidation(localValidation);

            if (localValidation.isValid && checkUniqueness) {
                setIsChecking(true);
                setIsUnique(null);

                try {
                    const unique = await checkUniqueness(value);
                    setIsUnique(unique);

                    if (!unique) {
                        setValidation({ isValid: false, error: '이미 사용 중인 사용자명입니다.' });
                    }
                } catch (error) {
                    setValidation({ isValid: false, error: '사용자명 확인 중 오류가 발생했습니다.' });
                } finally {
                    setIsChecking(false);
                }
            }

            onValidationChange?.(localValidation.isValid && (isUnique !== false));
        };

        if (value) {
            const debounceTimer = setTimeout(checkUsername, 300);
            return () => clearTimeout(debounceTimer);
        } else {
            setValidation({ isValid: true });
            setIsUnique(null);
            onValidationChange?.(false);
        }
    }, [value, checkUniqueness, onValidationChange, isUnique]);

    const getStatusIcon = () => {
        if (isChecking) return <Loader2 className="h-4 w-4 animate-spin text-blue-500"/>;
        if (!validation.isValid) return <XCircle className="h-4 w-4 text-red-500"/>;
        if (validation.isValid && isUnique === true) return <CheckCircle className="h-4 w-4 text-green-500"/>;
        return null;
    };

    const getStatusColor = () => {
        if (!validation.isValid) return 'border-red-500 focus-visible:ring-red-500';
        if (validation.isValid && isUnique === true) return 'border-green-500 focus-visible:ring-green-500';
        return '';
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="username" className={"text-muted-foreground"}>@username</Label>
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

            {/* 안내문 */
            }
            <div className="text-xs text-muted-foreground space-y-2">
                <p>• {` ${MIN_USER_NAME}-${MAX_USER_NAME}`}자 사이의 길이</p>
                <p>• 영문, 숫자, (-), (_)만 사용 가능</p>
                <p>• 첫 & 마지막 글자 영문 또는 숫자</p>
                <p>• 특수문자 연속 불가</p>
                <p>• <code className="bg-muted px-1 rounded">/profile/{value || 'username'}</code></p>
            </div>

            {/* 에러 메시지 */
            }
            {
                validation.error && (
                    <p className="text-sm text-red-500">{validation.error}</p>
                )
            }
        </div>
    )
        ;
}